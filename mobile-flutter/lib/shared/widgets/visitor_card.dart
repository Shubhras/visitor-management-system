import 'package:flutter/material.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';
import 'package:visitor_management/features/visitor/data/models/visitor_model.dart';

class VisitorCard extends StatelessWidget {
  final VisitorModel visitor;

  const VisitorCard({super.key, required this.visitor});

  Color getStatusColor() {
    switch (visitor.status) {
      case "APPROVED":
        return Colors.green;

      case "REJECTED":
        return Colors.red;

      default:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeSmall),

      decoration: BoxDecoration(
        color: AppColors.card,

        borderRadius: BorderRadius.circular(Dimensions.radiusLarge),

        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),

      child: Padding(
        padding: const EdgeInsets.all(Dimensions.paddingSizeDefault),

        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Avatar
            Container(
              height: 50,
              width: 50,

              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),

              child: const Icon(Icons.person, color: AppColors.primary),
            ),

            const SizedBox(width: Dimensions.paddingSizeDefault),

            /// Visitor Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,

                    children: [
                      Expanded(
                        child: Text(
                          visitor.name,
                          style: TextStyle(
                            fontSize: Dimensions.fontSizeLarge(context),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 4),

                  Text("Phone: ${visitor.phone}"),
                  Text("Unit: ${visitor.unitNumber}"),

                  const SizedBox(height: 6),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Visit: ${visitor.visitDate}",
                        style: TextStyle(
                          fontSize: Dimensions.fontSizeExtraSmall(context),
                          color: AppColors.textSecondary,
                        ),
                      ),

                      /// Status Badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),

                        decoration: BoxDecoration(
                          color: getStatusColor().withValues(alpha: 0.12),

                          borderRadius: BorderRadius.circular(20),
                        ),

                        child: Text(
                          visitor.status,
                          style: TextStyle(
                            color: getStatusColor(),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
