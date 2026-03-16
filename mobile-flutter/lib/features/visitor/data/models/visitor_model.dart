class VisitorModel {
  final int id;
  final String name;
  final String phone;
  final String unitNumber;
  final String visitDate;
  final String status;

  VisitorModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.unitNumber,
    required this.visitDate,
    required this.status,
  });

  factory VisitorModel.fromJson(Map<String, dynamic> json) {
    return VisitorModel(
      id: json['id'],
      name: json['name'],
      phone: json['phone'],
      unitNumber: json['unitNumber'],
      visitDate: json['visitDate'],
      status: json['status'],
    );
  }
}