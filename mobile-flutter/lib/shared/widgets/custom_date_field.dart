import 'package:flutter/material.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';

class CustomDateField extends StatelessWidget {
  final String hintText;
  final String? value;
  final VoidCallback onTap;
  final bool hasError;

  const CustomDateField({
    super.key,
    required this.hintText,
    required this.onTap,
    this.value,
    this.hasError = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: IgnorePointer(
        child: TextFormField(
          readOnly: true,
          controller: TextEditingController(text: value ?? ""),
          style: TextStyle(
            fontSize: Dimensions.fontSizeDefault(context),
            color: AppColors.textPrimary,
          ),
          decoration: InputDecoration(
            hintText: hintText,

            prefixIcon: const Icon(
              Icons.calendar_today,
              color: AppColors.primary,
            ),

            isDense: true,

            contentPadding: const EdgeInsets.symmetric(
              vertical: 16,
              horizontal: Dimensions.paddingSizeDefault,
            ),

            filled: true,
            fillColor: const Color.fromARGB(0, 255, 255, 255),

            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
              borderSide: BorderSide(
                color: hasError ? AppColors.error : AppColors.border,
              ),
            ),

            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
              borderSide: BorderSide(
                color: hasError ? AppColors.error : AppColors.border,
              ),
            ),

            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
              borderSide: const BorderSide(
                color: AppColors.primary,
                width: 1.2,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
