import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/core/services/api_service.dart';
import 'package:visitor_management/core/services/mock_visitor_service.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_event.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_state.dart';

class VisitorBloc extends Bloc<VisitorEvent, VisitorState> {
  final ApiService apiService;

  final MockVisitorService mockService = MockVisitorService();

  VisitorBloc(this.apiService) : super(VisitorInitial()) {
    on<FetchVisitors>(_fetchVisitors);
  }

  /// Fetch Visitors
  Future<void> _fetchVisitors(
    FetchVisitors event,
    Emitter<VisitorState> emit,
  ) async {
    emit(VisitorLoading());

    try {
      final visitors = await mockService.fetchVisitors();

      emit(VisitorLoaded(visitors));
    } catch (e) {
      emit(VisitorError(e.toString()));
    }
  }


}
