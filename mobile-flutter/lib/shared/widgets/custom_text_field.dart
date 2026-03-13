import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';

class CustomTextField extends StatelessWidget {

  final TextEditingController controller;
  final String label;
  final IconData prefixIcon;
  final bool obscureText;
  final TextInputType keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final Widget? suffixIcon;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;

  const CustomTextField({
    super.key,
    required this.controller,
    required this.label,
    required this.prefixIcon,
    this.obscureText = false,
    this.suffixIcon,
    this.validator,
    this.onChanged,
    this.keyboardType = TextInputType.text,
    this.inputFormatters,
  });

  @override
  Widget build(BuildContext context) {

    return TextFormField(

      controller: controller,
      obscureText: obscureText,
      validator: validator,
      onChanged: onChanged,
      keyboardType: keyboardType, 
      inputFormatters: inputFormatters,
      
      style: TextStyle(
        fontSize: Dimensions.fontSizeDefault(context),
        color: AppColors.textPrimary,
      ),

      decoration: InputDecoration(

        labelText: label,

        prefixIcon: Icon(
          prefixIcon,
          color: AppColors.primary,
        ),

        suffixIcon: suffixIcon,

        errorStyle: TextStyle(
          fontSize: Dimensions.fontSizeExtraSmall(context),
          color: AppColors.error,
        ),

        contentPadding: const EdgeInsets.symmetric(
          vertical: Dimensions.paddingSizeDefault,
          horizontal: Dimensions.paddingSizeSmall,
        ),

        border: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(Dimensions.radiusDefault),
          borderSide: const BorderSide(
            color: AppColors.border,
          ),
        ),

        enabledBorder: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(Dimensions.radiusDefault),
          borderSide: const BorderSide(
            color: AppColors.border,
          ),
        ),

        focusedBorder: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(Dimensions.radiusDefault),
          borderSide: const BorderSide(
            color: AppColors.primary,
            width: 1.5,
          ),
        ),

        errorBorder: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(Dimensions.radiusDefault),
          borderSide: const BorderSide(
            color: AppColors.error,
          ),
        ),

        focusedErrorBorder: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(Dimensions.radiusDefault),
          borderSide: const BorderSide(
            color: AppColors.error,
            width: 1.5,
          ),
        ),
      ),
    );
  }
}