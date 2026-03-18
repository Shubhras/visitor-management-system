import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';
import 'package:visitor_management/core/navigation/main_navigation_screen.dart';
import 'package:visitor_management/core/utils/validators.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_event.dart';
import 'package:visitor_management/features/auth/presentation/bloc/auth_state.dart';
import 'package:visitor_management/shared/widgets/custom_button.dart';
import 'package:visitor_management/shared/widgets/custom_text_field.dart';

/// Login Screen
/// Handles user authentication using email & password
/// Uses Bloc for state management

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  /// Form key for validation
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  /// Controllers for input fields
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  /// Password visibility toggle
  bool obscurePassword = true;

  /// Tracks form validity (used to enable/disable button)
  bool isFormValid = false;

  /// Validate form on input change
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

      /// Tap anywhere to dismiss keyboard
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),

        /// Listen to AuthBloc state changes (Success / Failure)
        child: BlocListener<AuthBloc, AuthState>(
          listener: (context, state) {
            /// On successful login → Navigate to main screen
            if (state is AuthSuccess) {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
              );
            }

            /// On login failure → Show error message
            if (state is AuthFailure) {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text(state.message)));
            }
          },

          child: SafeArea(
            child: Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: Dimensions.paddingSizeLarge,
                  ),

                  child: Column(
                    children: [
                      /// App Logo
                      SizedBox(
                        height: 150,
                        child: Image.asset(
                          "assets/images/genio360_logo.png",
                          fit: BoxFit.contain,
                          filterQuality: FilterQuality.high,
                        ),
                      ),

                      /// Title
                      Text(
                        "Let's Sign In",
                        style: TextStyle(
                          fontSize: Dimensions.fontSizeOverLarge(context),
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),

                      const SizedBox(height: 6),

                      /// Subtitle
                      Text(
                        "Visitor management system access",
                        style: TextStyle(
                          fontSize: Dimensions.fontSizeSmall(context),
                          color: AppColors.textSecondary,
                        ),
                      ),

                      const SizedBox(
                        height: Dimensions.paddingSizeExtremeLarge,
                      ),

                      /// Login Card Container
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

                        /// Form for validation
                        child: Form(
                          key: _formKey,

                          /// Auto validate on user interaction
                          autovalidateMode: AutovalidateMode.onUserInteraction,

                          child: Column(
                            children: [
                              /// Email Field
                              CustomTextField(
                                controller: emailController,
                                label: "Email Address",
                                prefixIcon: Icons.email_outlined,
                                keyboardType: TextInputType.emailAddress,

                                /// Email validation from Validators
                                validator: Validators.email,

                                /// Prevent spaces in email
                                inputFormatters: [
                                  FilteringTextInputFormatter.deny(
                                    RegExp(r"\s"),
                                  ),
                                ],

                                /// Validate form on change
                                onChanged: (_) => checkForm(),
                              ),

                              const SizedBox(
                                height: Dimensions.paddingSizeDefault,
                              ),

                              /// Password Field
                              CustomTextField(
                                controller: passwordController,
                                label: "Password",
                                prefixIcon: Icons.lock_outline,

                                /// Toggle password visibility
                                obscureText: obscurePassword,

                                /// Password validation
                                validator: Validators.password,

                                onChanged: (_) => checkForm(),

                                /// Eye icon toggle
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

                              const SizedBox(
                                height: Dimensions.paddingSizeLarge,
                              ),

                              /// Login Button
                              BlocBuilder<AuthBloc, AuthState>(
                                builder: (context, state) {
                                  final isLoading = state is AuthLoading;

                                  return CustomButton(
                                    text: "Sign In",
                                    isLoading: isLoading,

                                    /// Trigger login event
                                    onPressed: isFormValid
                                        ? () {
                                            FocusScope.of(context).unfocus();

                                            if (_formKey.currentState!
                                                .validate()) {
                                              context.read<AuthBloc>().add(
                                                LoginRequested(
                                                  email: emailController.text,
                                                  password:
                                                      passwordController.text,
                                                ),
                                              );
                                            }
                                          }
                                        : null,
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: Dimensions.paddingSizeLarge),

                      /// Footer Text
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
      ),
    );
  }
}
