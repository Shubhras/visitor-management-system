import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:visitor_management/features/visitor/data/models/visitor_model.dart';

class MockVisitorService {
  Future<List<VisitorModel>> fetchVisitors() async {
    final String jsonString = await rootBundle.loadString(
      'assets/mock/visitors.json',
    );

    final List data = json.decode(jsonString);

    return data.map((json) => VisitorModel.fromJson(json)).toList();
  }
}
