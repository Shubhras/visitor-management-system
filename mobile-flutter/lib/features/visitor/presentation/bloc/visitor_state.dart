import 'package:visitor_management/features/visitor/data/models/visitor_model.dart';

abstract class VisitorState {}

class VisitorInitial extends VisitorState {}

class VisitorLoading extends VisitorState {}

class VisitorLoaded extends VisitorState {
  final List<VisitorModel> visitors;

  VisitorLoaded(this.visitors);
}

class VisitorError extends VisitorState {
  final String message;

  VisitorError(this.message);
}
