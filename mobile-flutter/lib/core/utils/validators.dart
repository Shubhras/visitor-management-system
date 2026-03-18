class Validators {
  /// Required Field
  static String? required(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return "$fieldName is required";
    }
    return null;
  }

  /// Visitor Name
  static String? name(String? value) {
  if (value == null || value.trim().isEmpty) {
    return "Visitor name is required";
  }

  if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value.trim())) {
    return "Only alphabets allowed";
  }

  if (value.trim().length < 3) {
    return "Minimum 3 characters required";
  }

  if (value.trim().length > 50) {
    return "Maximum 50 characters allowed";
  }

  return null;
}
static String? phone(String? value) {
  if (value == null || value.trim().isEmpty) {
    return "Phone number is required";
  }

  value = value.trim();

  if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
    return "Only digits allowed";
  }

  if (value.length != 10) {
    return "Enter valid 10 digit phone number";
  }

  // Reject all same digits (0000000000, 1111111111, etc.)
  if (RegExp(r'^(\d)\1{9}$').hasMatch(value)) {
    return "Invalid phone number";
  }
  return null;
}
  /// Unit Number
  static String? unit(String? value) {
    if (value == null || value.trim().isEmpty) {
      return "Unit number is required";
    }
    if (value.trim().length < 3) {
      return "Minimum 3 characters required";
    }
    if (value.trim().length > 10) {
      return "Maximum 10 characters allowed";
    }

    if (!RegExp(r'^[a-zA-Z0-9\-\/]+$').hasMatch(value)) {
      return "Invalid unit format";
    }

    return null;
  }
}
