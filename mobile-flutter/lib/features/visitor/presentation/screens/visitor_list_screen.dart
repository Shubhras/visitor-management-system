import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:visitor_management/core/constants/app_colors.dart';
import 'package:visitor_management/core/constants/dimensions.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_bloc.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_event.dart';
import 'package:visitor_management/features/visitor/presentation/bloc/visitor_state.dart';
import 'package:visitor_management/shared/widgets/app_bar_widget.dart';
import 'package:visitor_management/shared/widgets/error_widget.dart';
import 'package:visitor_management/shared/widgets/shimmer_loading.dart';
import 'package:visitor_management/shared/widgets/visitor_card.dart';

/// VisitorListScreen
/// Displays the list of visitors with pagination and pull-to-refresh functionality.
/// Handles different UI states such as loading, error, empty, and success using Bloc.

class VisitorListScreen extends StatefulWidget {
  /// Callback to open navigation drawer
  final VoidCallback openDrawer;

  const VisitorListScreen({super.key, required this.openDrawer});

  @override
  State<VisitorListScreen> createState() => _VisitorListScreenState();
}

class _VisitorListScreenState extends State<VisitorListScreen> {
  /// Scroll controller used for pagination detection
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    /// Trigger initial API call to fetch visitors
    context.read<VisitorBloc>().add(FetchVisitors());

    /// Listen for scroll events to implement infinite scrolling
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent) {
        /// Load next page when user reaches bottom
        context.read<VisitorBloc>().add(LoadMoreVisitors());
      }
    });
  }

  /// Handles pull-to-refresh action
  /// Triggers refresh event without showing shimmer
  Future<void> _onRefresh() async {
    context.read<VisitorBloc>().add(RefreshVisitors());

    /// Small delay to ensure refresh animation is visible
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,

      /// Custom AppBar with drawer action
      appBar: AppBarWidget(
        title: "Visitors List",
        onMenuTap: widget.openDrawer,
      ),

      /// Floating action button for creating a new visitor
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        onPressed: () {
          /// Navigation can be added here for CreateVisitorScreen
          print("Visitor Create Screen");
        },
        child: const Icon(Icons.add, color: AppColors.textLight),
      ),

      /// Main content area
      body: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: Dimensions.paddingSizeDefault,
        ),

        /// Listener for handling one-time effects such as showing error messages
        child: BlocListener<VisitorBloc, VisitorState>(
          listener: (context, state) {
            if (state is VisitorError) {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text(state.message)));
            }
          },

          /// Builder for rendering UI based on current state
          child: BlocBuilder<VisitorBloc, VisitorState>(
            builder: (context, state) {
              /// Initial loading state (first API call)
              if (state is VisitorLoading) {
                return const ShimmerLoading();
              }

              /// Error state
              if (state is VisitorError) {
                return CustomErrorWidget(message: state.message);
              }

              /// Data loaded successfully
              if (state is VisitorLoaded) {
                /// Empty state with pull-to-refresh support
                if (state.visitors.isEmpty) {
                  return RefreshIndicator(
                    onRefresh: _onRefresh,
                    child: ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(
                          height: MediaQuery.of(context).size.height * 0.7,
                          child: Center(
                            child: Text(
                              "No Visitors Found",
                              style: TextStyle(
                                fontSize: Dimensions.fontSizeDefault(context),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }

                /// List view with pagination and pull-to-refresh
                return RefreshIndicator(
                  onRefresh: _onRefresh,
                  child: ListView.builder(
                    controller: _scrollController,
                    /// Ensures refresh works even with small lists
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(
                      vertical: Dimensions.paddingSizeSmall,
                    ),
                    itemCount: state.visitors.length,
                    itemBuilder: (context, index) {
                      final visitor = state.visitors[index];

                      /// Individual visitor card
                      return VisitorCard(visitor: visitor);
                    },
                  ),
                );
              }

              /// Fallback UI (should rarely be reached)
              return const SizedBox();
            },
          ),
        ),
      ),
    );
  }
}
