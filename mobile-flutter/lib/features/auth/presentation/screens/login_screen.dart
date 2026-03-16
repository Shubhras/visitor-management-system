import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';
import 'package:visitor_management/shared/widgets/custom_button.dart';
import 'package:visitor_management/shared/widgets/custom_text_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  bool obscurePassword = true;
  bool isFormValid = false;

  /// Email validation
  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return "Email is required";
    }

    final emailRegex = RegExp(r'^[\w\.-]+@([\w\-]+\.)+[A-Za-z]{2,4}$');

    if (!emailRegex.hasMatch(value)) {
      return "Enter a valid email address";
    }

    return null;
  }

  /// Password validation
  String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return "Password is required";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  }

  void checkForm() {
    final isValid = _formKey.currentState?.validate() ?? false;

    setState(() {
      isFormValid = isValid;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,

      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),

        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: Dimensions.paddingSizeLarge,
                ),

                child: Column(
                  children: [
                    /// APP LOGO
                    SizedBox(
                      height: 150,
                      child: Image.asset(
                        "assets/images/genio360_logo.png",
                        fit: BoxFit.contain,
                        filterQuality: FilterQuality.high,
                      ),
                    ),
                    // const SizedBox(height: Dimensions.paddingSizeLarge),

                    /// TITLE
                    Text(
                      "Let's Sign In",
                      style: TextStyle(
                        fontSize: Dimensions.fontSizeOverLarge(context),
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),

                    const SizedBox(height: 6),

                    Text(
                      "Visitor management system access",
                      style: TextStyle(
                        fontSize: Dimensions.fontSizeSmall(context),
                        color: AppColors.textSecondary,
                      ),
                    ),

                    const SizedBox(height: Dimensions.paddingSizeExtremeLarge),

                    /// LOGIN CARD
                    Container(
                      padding: const EdgeInsets.all(
                        Dimensions.paddingSizeLarge,
                      ),

                      decoration: BoxDecoration(
                        color: AppColors.card,
                        borderRadius: BorderRadius.circular(
                          Dimensions.radiusLarge,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),

                      child: Form(
                        key: _formKey,
                        autovalidateMode: AutovalidateMode.onUserInteraction,

                        child: Column(
                          children: [
                            /// EMAIL
                            CustomTextField(
                              controller: emailController,
                              label: "Email Address",
                              prefixIcon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              validator: validateEmail,
                              inputFormatters: [
                                FilteringTextInputFormatter.deny(RegExp(r"\s")),
                              ],
                              onChanged: (_) => checkForm(),
                            ),

                            const SizedBox(
                              height: Dimensions.paddingSizeDefault,
                            ),

                            /// PASSWORD
                            CustomTextField(
                              controller: passwordController,
                              label: "Password",
                              prefixIcon: Icons.lock_outline,
                              obscureText: obscurePassword,
                              validator: validatePassword,
                              onChanged: (_) => checkForm(),

                              suffixIcon: IconButton(
                                icon: Icon(
                                  obscurePassword
                                      ? Icons.visibility_off
                                      : Icons.visibility,
                                ),

                                onPressed: () {
                                  setState(() {
                                    obscurePassword = !obscurePassword;
                                  });
                                },
                              ),
                            ),

                            const SizedBox(height: Dimensions.paddingSizeLarge),

                            /// LOGIN BUTTON
                            CustomButton(
                              text: "Sign In",
                              onPressed: isFormValid
                                  ? () {
                                      FocusScope.of(context).unfocus();

                                      print("Successfully login!!!!");
                                    }
                                  : null,
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: Dimensions.paddingSizeLarge),

                    /// FOOTER TEXT
                    Text(
                      "Genio360 Visitor Management",
                      style: TextStyle(
                        fontSize: Dimensions.fontSizeExtraSmall(context),
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
