import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

/// CreateVisitorScreen
/// This screen allows users to create a new visitor entry.
/// It includes form validation, date selection, and Bloc integration
/// for handling API requests and responses.

class CreateVisitorScreen extends StatefulWidget {
  const CreateVisitorScreen({super.key});

  @override
  State<CreateVisitorScreen> createState() => _CreateVisitorScreenState();
}

class _CreateVisitorScreenState extends State<CreateVisitorScreen> {
  /// Form key used to validate all input fields
  final _formKey = GlobalKey<FormState>();

  /// Controllers for text input fields
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final unitController = TextEditingController();

  /// Stores selected visit date
  DateTime? visitDate;

  /// Controls loading state of submit button
  bool isLoading = false;

  /// Flag to show date validation error
  bool dateError = false;

  /// Flag to trigger validation after first submit attempt
  bool isSubmitted = false;

  /// Checks if all fields have values (used to enable/disable submit button)
  bool get isFormValid {
    return nameController.text.isNotEmpty &&
        phoneController.text.isNotEmpty &&
        unitController.text.isNotEmpty &&
        visitDate != null;
  }

  /// Opens date picker and updates selected date
  void pickDate() {
    DatePicker.showDatePicker(
      context,
      minTime: DateTime.now(), // Prevent past dates
      onConfirm: (date) {
        setState(() {
          visitDate = date;
          dateError = false;
        });
      },
    );
  }

  /// Handles form submission
  void submitVisitor() {
    setState(() {
      isSubmitted = true;
    });

    /// Validate all form fields
    if (!_formKey.currentState!.validate()) return;

    /// Validate date selection separately
    if (visitDate == null) {
      setState(() => dateError = true);
      return;
    }

    setState(() {
      isLoading = true;
    });

    /// Dismiss keyboard
    FocusScope.of(context).unfocus();

    /// Trigger Bloc event to create visitor
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
        /// On successful visitor creation
        if (state is VisitorLoaded) {
          Navigator.pop(context);

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Visitor created successfully")),
          );
        }

        /// On error
        if (state is VisitorError) {
          setState(() {
            isLoading = false;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }
      },

      child: Scaffold(
        backgroundColor: AppColors.background,

        /// App bar configuration
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

        /// Main form container
        body: Padding(
          padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),

          child: Form(
            key: _formKey,

            /// Validation starts after first submit attempt
            autovalidateMode: isSubmitted
                ? AutovalidateMode.always
                : AutovalidateMode.disabled,

            child: Column(
              children: [
                /// Visitor Name Field
                CustomTextField(
                  controller: nameController,
                  label: "Visitor Name",
                  prefixIcon: Icons.person,

                  /// Name validation
                  validator: Validators.name,

                  /// Allow only alphabets and spaces
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(
                      RegExp(r'[a-zA-Z\s]'),
                    ),
                  ],

                  onChanged: (_) => setState(() {}),
                ),

                const SizedBox(height: Dimensions.paddingSizeDefault),

                /// Phone Number Field
                CustomTextField(
                  controller: phoneController,
                  label: "Phone Number",
                  prefixIcon: Icons.phone,
                  keyboardType: TextInputType.number,

                  /// Phone validation
                  validator: Validators.phone,

                  /// Allow only digits and limit to 10 characters
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(10),
                  ],

                  onChanged: (_) => setState(() {}),
                ),

                const SizedBox(height: Dimensions.paddingSizeDefault),

                /// Unit Number Field
                CustomTextField(
                  controller: unitController,
                  label: "Unit Number",
                  prefixIcon: Icons.home,

                  /// Unit validation
                  validator: Validators.unit,

                  /// Limit input length
                  inputFormatters: [
                    LengthLimitingTextInputFormatter(10),
                  ],

                  onChanged: (_) => setState(() {}),
                ),

                const SizedBox(height: Dimensions.paddingSizeDefault),

                /// Visit Date Picker Field
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

                  /// Enabled only when form is filled
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