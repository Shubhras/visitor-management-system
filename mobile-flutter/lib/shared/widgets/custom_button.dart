import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/dimensions.dart';

class CustomButton extends StatelessWidget {

  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {

    return SizedBox(
      width: double.infinity,
      height: 50,

      child: ElevatedButton(

        onPressed: isLoading ? null : onPressed,

        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          shape: RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(Dimensions.radiusDefault),
          ),
        ),

        child: isLoading
            ? SizedBox(
                height: 22,
                width: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.textLight,
                ),
              )
            : Text(
                text,
                style: TextStyle(
                  fontSize:
                      Dimensions.fontSizeDefault(context),
                  fontWeight: FontWeight.bold,
                  color: AppColors.textLight,
                ),
              ),
      ),
    );
  }
}