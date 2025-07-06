"""update_user_model_fields

Revision ID: 9d808655cc31
Revises: f4015e937844
Create Date: 2025-07-06 04:59:56.408388

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9d808655cc31'
down_revision: Union[str, Sequence[str], None] = 'f4015e937844'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add new columns to users table
    op.add_column('users', sa.Column('phone_number', sa.String(), nullable=False))
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'))
    op.add_column('users', sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')))
    op.add_column('users', sa.Column('last_login_at', sa.DateTime(), nullable=True))
    
    # Create index for phone_number
    op.create_index(op.f('ix_users_phone_number'), 'users', ['phone_number'], unique=True)
    
    # Make full_name not nullable
    op.alter_column('users', 'full_name',
                    existing_type=sa.String(),
                    nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop index
    op.drop_index(op.f('ix_users_phone_number'), table_name='users')
    
    # Drop columns
    op.drop_column('users', 'last_login_at')
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'created_at')
    op.drop_column('users', 'is_verified')
    op.drop_column('users', 'is_active')
    op.drop_column('users', 'phone_number')
    
    # Make full_name nullable again
    op.alter_column('users', 'full_name',
                    existing_type=sa.String(),
                    nullable=True)
