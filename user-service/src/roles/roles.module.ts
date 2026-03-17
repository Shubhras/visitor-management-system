import { Module } from '@nestjs/common';

// The roles module is intentionally lightweight.
// It exists as a named module so other modules can import it cleanly
// and so we have a single place to expand role logic later if needed.
@Module({
  exports: [],
})
export class RolesModule {}