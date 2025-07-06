""""Change_airport_ID_to_string_and_update_related_fields"

Revision ID: f4015e937844
Revises: 1b1d77edd6d3
Create Date: 2025-07-04 19:14:01.969824

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f4015e937844'
down_revision: Union[str, Sequence[str], None] = '1b1d77edd6d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop foreign key constraints first
    op.drop_constraint('flights_departure_airport_id_fkey', 'flights', type_='foreignkey')
    op.drop_constraint('flights_arrival_airport_id_fkey', 'flights', type_='foreignkey')
    
    # Change column types
    op.alter_column('airports', 'id',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=3),
               existing_nullable=False)
    op.drop_index('ix_airports_code', table_name='airports')
    op.drop_column('airports', 'code')
    op.alter_column('flights', 'departure_airport_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=3),
               existing_nullable=False)
    op.alter_column('flights', 'arrival_airport_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=3),
               existing_nullable=False)
               
    # Recreate foreign key constraints
    op.create_foreign_key('flights_departure_airport_id_fkey', 'flights', 'airports',
                         ['departure_airport_id'], ['id'])
    op.create_foreign_key('flights_arrival_airport_id_fkey', 'flights', 'airports',
                         ['arrival_airport_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop foreign key constraints first
    op.drop_constraint('flights_departure_airport_id_fkey', 'flights', type_='foreignkey')
    op.drop_constraint('flights_arrival_airport_id_fkey', 'flights', type_='foreignkey')
    
    # Change column types back
    op.alter_column('flights', 'arrival_airport_id',
               existing_type=sa.String(length=3),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('flights', 'departure_airport_id',
               existing_type=sa.String(length=3),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.add_column('airports', sa.Column('code', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.create_index('ix_airports_code', 'airports', ['code'], unique=True)
    op.alter_column('airports', 'id',
               existing_type=sa.String(length=3),
               type_=sa.INTEGER(),
               existing_nullable=False)
               
    # Recreate foreign key constraints
    op.create_foreign_key('flights_departure_airport_id_fkey', 'flights', 'airports',
                         ['departure_airport_id'], ['id'])
    op.create_foreign_key('flights_arrival_airport_id_fkey', 'flights', 'airports',
                         ['arrival_airport_id'], ['id'])
