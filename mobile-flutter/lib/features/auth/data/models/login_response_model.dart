
class UserModel {
  final int id;
  final String? name;
  final String email;
  final String role;

  UserModel({
    required this.id,
    this.name,
    required this.email,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      name: json['name']?.toString(),
      email: json['email']?.toString() ?? "",
      role: json['role']?.toString() ?? "",
    );
  }
}

class LoginResponseModel {
  final bool success;
  final String accessToken;
  final String refreshToken;
  final UserModel user;

  LoginResponseModel({
    required this.success,
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    return LoginResponseModel(
      success: json['success'] ?? false,
      accessToken: json['accessToken']?.toString() ?? "",
      refreshToken: json['refreshToken']?.toString() ?? "",
      user: UserModel.fromJson(json['user'] ?? {}), 
    );
  }

  bool get isResident => user.role == "resident";
}