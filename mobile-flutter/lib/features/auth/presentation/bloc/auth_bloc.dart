import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/core/constants/app_constants.dart';
import 'package:visitor_management/core/services/api_service.dart';
import 'package:visitor_management/core/utils/token_storage.dart';
import 'package:visitor_management/features/auth/data/models/login_response_model.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_event.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final ApiService apiService;

  AuthBloc(this.apiService) : super(AuthInitial()) {
    on<LoginRequested>(_onLogin);
    on<LogoutRequested>(_onLogout);
  }

  Future<void> _onLogin(LoginRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      final response = await apiService.post(AppConstants.loginEndpoint, {
        "email": event.email.trim(),
        "password": event.password.trim(),
      });

      final data = jsonDecode(response.body);

      /// ✅ Handle success + failure from same 200 response
      if (response.statusCode == 200) {
        if (data["success"] == true) {
          final loginResponse = LoginResponseModel.fromJson(data);

          await TokenStorage.saveToken(loginResponse.accessToken);

          emit(AuthSuccess());
        } else {
          emit(AuthFailure(data["message"] ?? "Login failed"));
        }
      } else {
        emit(AuthFailure("Server error (${response.statusCode})"));
      }
    } catch (e) {
      emit(AuthFailure("Something went wrong"));
    }
  }

  Future<void> _onLogout(LogoutRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      final response = await apiService.post(AppConstants.logoutEndpoint, {});

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["success"] == true) {
          await TokenStorage.clearToken();

          emit(AuthLoggedOut());
        } else {
          emit(AuthFailure("Logout failed"));
        }
      } else {
        emit(AuthFailure("Logout API error"));
      }
    } catch (e) {
      emit(AuthFailure(e.toString()));
    }
  }
}
