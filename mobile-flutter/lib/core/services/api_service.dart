import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:visitor_management/core/utils/token_storage.dart';

class ApiService {
  final String baseUrl = dotenv.env['BASE_URL'] ?? "";

  Future<http.Response> get(String endpoint) async {
    final token = await TokenStorage.getToken();

    return http.get(
      Uri.parse(baseUrl + endpoint),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
  }

  Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final token = await TokenStorage.getToken();

    final headers = {"Content-Type": "application/json"};

    /// Authorization header only if token exists
    if (token != null && token.isNotEmpty) {
      headers["Authorization"] = "Bearer $token";
    }

    return http.post(
      Uri.parse(baseUrl + endpoint),
      headers: headers,
      body: jsonEncode(body),
    );
  }
}
