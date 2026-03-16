class LoginResponseModel {

  final bool success;
  final String accessToken;
  final String refreshToken;

  LoginResponseModel({
    required this.success,
    required this.accessToken,
    required this.refreshToken,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {

    return LoginResponseModel(
      success: json['success'],
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
    );
  }
}