import 'package:intl/intl.dart';

class VisitorModel {
  final int id;
  final String name;
  final String phone;
  final String unitNumber;
  final String visitDate;
  final String status;

  // Extra fields optional (mock JSON mein nahi hain)
  final int? createdBy;
  final String? createdAt;
  final String? updatedAt;

  VisitorModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.unitNumber,
    required this.visitDate,
    required this.status,
    this.createdBy,
    this.createdAt,
    this.updatedAt,
  });

  factory VisitorModel.fromJson(Map<String, dynamic> json) {
    return VisitorModel(
      id: json['id'],
      name: json['name'],
      phone: json['phone'],
      unitNumber: json['unitNumber'],
      visitDate: json['visitDate'],
      status: json['status'],
      createdBy: json['createdBy'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }

  String get formattedVisitDate => DateFormat('dd MMM yyyy').format(DateTime.parse(visitDate));
}