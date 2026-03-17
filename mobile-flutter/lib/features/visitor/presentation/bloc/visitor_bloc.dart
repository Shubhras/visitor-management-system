import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/core/constants/app_constants.dart';
import 'package:visitor_management/core/services/api_service.dart';
import 'package:visitor_management/features/visitor/data/models/visitor_model.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_event.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_state.dart';

class VisitorBloc extends Bloc<VisitorEvent, VisitorState> {
  final ApiService apiService;

  int page = 1;
  final int limit = 10;

  bool hasNextPage = true;
  bool isLoadingMore = false;

  List<VisitorModel> visitors = [];

  VisitorBloc(this.apiService) : super(VisitorInitial()) {
    on<FetchVisitors>(_fetchVisitors);
    on<LoadMoreVisitors>(_loadMoreVisitors);
    on<CreateVisitor>(_createVisitor);
  }

  /// First Load
  Future<void> _fetchVisitors(
    FetchVisitors event,
    Emitter<VisitorState> emit,
  ) async {
    emit(VisitorLoading());

    try {
      page = 1;

      final response = await apiService.get(
        "${AppConstants.visitorsEndpoint}?page=$page&limit=$limit",
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);

        final List data = json["data"];

        visitors = data.map((e) => VisitorModel.fromJson(e)).toList();

        hasNextPage = json["pagination"]["hasNextPage"];

        emit(VisitorLoaded(visitors));
      } else {
        emit(VisitorError("Failed to load visitors"));
      }
    } catch (e) {
      emit(VisitorError(e.toString()));
    }
  }

  /// Pagination
  Future<void> _loadMoreVisitors(
    LoadMoreVisitors event,
    Emitter<VisitorState> emit,
  ) async {
    if (!hasNextPage || isLoadingMore) return;

    isLoadingMore = true;

    try {
      page++;

      final response = await apiService.get(
        "${AppConstants.visitorsEndpoint}?page=$page&limit=$limit",
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);

        final List data = json["data"];

        final newVisitors = data.map((e) => VisitorModel.fromJson(e)).toList();

        visitors.addAll(newVisitors);

        hasNextPage = json["pagination"]["hasNextPage"];

        emit(VisitorLoaded(List.from(visitors)));
      }
    } catch (e) {
      emit(VisitorError(e.toString()));
    }

    isLoadingMore = false;
  }

  /// Create Visitor
  Future<void> _createVisitor(
    CreateVisitor event,
    Emitter<VisitorState> emit,
  ) async {
    try {
      final response = await apiService.post(
        AppConstants.visitorsEndpoint,
        event.data,
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final json = jsonDecode(response.body);

        if (json["success"] == true) {
          /// refresh list
          add(FetchVisitors());
        } else {
          emit(VisitorError("Failed to create visitor"));
        }
      } else {
        emit(VisitorError("Visitor creation failed"));
      }
    } catch (e) {
      emit(VisitorError(e.toString()));
    }
  }
}
