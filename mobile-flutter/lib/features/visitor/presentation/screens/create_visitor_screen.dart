import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_datetime_picker_plus/flutter_datetime_picker_plus.dart';
import 'package:intl/intl.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';
import 'package:visitor_management/core/utils/validators.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_bloc.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_event.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_state.dart';
import 'package:visitor_management/shared/widgets/custom_button.dart';
import 'package:visitor_management/shared/widgets/custom_date_field.dart';
import 'package:visitor_management/shared/widgets/custom_text_field.dart';

class CreateVisitorScreen extends StatefulWidget {
  const CreateVisitorScreen({super.key});

  @override
  State<CreateVisitorScreen> createState() => _CreateVisitorScreenState();
}

class _CreateVisitorScreenState extends State<CreateVisitorScreen> {
  final _formKey = GlobalKey<FormState>();

  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final unitController = TextEditingController();

  DateTime? visitDate;

  bool isLoading = false;
  bool dateError = false;
  bool isSubmitted = false;

  /// Validation
  String? validateRequired(String? value, String field) {
    if (value == null || value.isEmpty) {
      return "$field is required";
    }

    return null;
  }

  bool get isFormValid {
    return nameController.text.isNotEmpty &&
        phoneController.text.isNotEmpty &&
        unitController.text.isNotEmpty &&
        visitDate != null;
  }

  /// Date Picker
  void pickDate() {
    DatePicker.showDatePicker(
      context,
      minTime: DateTime.now(),
      onConfirm: (date) {
        setState(() {
          visitDate = date;
          dateError = false;
        });
      },
    );
  }

  String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return "Phone number is required";
    }

    if (!RegExp(r'^[0-9]{10}$').hasMatch(value)) {
      return "Enter valid 10 digit phone number";
    }

    return null;
  }

  void submitVisitor() {
    setState(() {
      isSubmitted = true;
    });

    if (!_formKey.currentState!.validate()) return;

    if (visitDate == null) {
      setState(() => dateError = true);
      return;
    }

    setState(() {
      isLoading = true;
    });

    context.read<VisitorBloc>().add(
      CreateVisitor({
        "name": nameController.text.trim(),
        "phone": phoneController.text.trim(),
        "unitNumber": unitController.text.trim(),
        "visitDate": DateFormat('yyyy-MM-dd').format(visitDate!),
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<VisitorBloc, VisitorState>(
      listener: (context, state) {
        if (state is VisitorLoaded) {
          Navigator.pop(context);

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Visitor created successfully")),
          );
        }

        if (state is VisitorError) {
          setState(() {
            isLoading = false;
          });

          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.message)));
        }
      },

      child: Scaffold(
        backgroundColor: AppColors.background,

        appBar: AppBar(
          backgroundColor: AppColors.primary,
          iconTheme: const IconThemeData(color: Colors.white),
          title: Text(
            "Create Visitor",
            style: TextStyle(
              fontSize: Dimensions.fontSizeLarge(context),
              fontWeight: FontWeight.bold,
              color: AppColors.textLight,
            ),
          ),
        ),

        body: Padding(
          padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),

          child: Form(
            key: _formKey,
            autovalidateMode: isSubmitted
                ? AutovalidateMode.always
                : AutovalidateMode.disabled,
            child: Column(
              children: [
                /// Visitor Name
                CustomTextField(
                  controller: nameController,
                  label: "Visitor Name",
                  prefixIcon: Icons.person,
                  validator: Validators.name,
                  onChanged: (_) => setState(() {}),
                ),

                const SizedBox(height: Dimensions.paddingSizeDefault),

                /// Phone
                CustomTextField(
                  controller: phoneController,
                  label: "Phone Number",
                  prefixIcon: Icons.phone,
                  keyboardType: TextInputType.number,
                  validator: Validators.phone,
                  onChanged: (_) {
                    if (phoneController.text.length > 10) {
                      phoneController.text = phoneController.text.substring(
                        0,
                        10,
                      );
                      phoneController.selection = TextSelection.fromPosition(
                        TextPosition(offset: phoneController.text.length),
                      );
                    }
                    setState(() {});
                  },
                ),

                const SizedBox(height: Dimensions.paddingSizeDefault),

                /// Unit
                CustomTextField(
                  controller: unitController,
                  label: "Unit Number",
                  prefixIcon: Icons.home,
                  validator: Validators.unit,
                  onChanged: (_) => setState(() {}),
                ),

                const SizedBox(height: Dimensions.paddingSizeDefault),

                CustomDateField(
                  hintText: "Select Visit Date",
                  value: visitDate == null
                      ? null
                      : DateFormat('yyyy-MM-dd').format(visitDate!),
                  hasError: dateError,
                  onTap: pickDate,
                ),

                const SizedBox(height: Dimensions.paddingSizeLarge),

                /// Submit Button
                CustomButton(
                  text: "Submit",

                  isLoading: isLoading,

                  onPressed: isFormValid ? submitVisitor : null,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
