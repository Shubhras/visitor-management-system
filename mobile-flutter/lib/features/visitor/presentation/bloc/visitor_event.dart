abstract class VisitorEvent {}

class FetchVisitors extends VisitorEvent {}

class RefreshVisitors extends VisitorEvent {}

class CreateVisitor extends VisitorEvent {

  final Map<String, dynamic> data;

  CreateVisitor(this.data);

}

class LoadMoreVisitors extends VisitorEvent {}