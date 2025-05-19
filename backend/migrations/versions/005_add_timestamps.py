"""Add timestamps

Revision ID: 005
Revises: 004
Create Date: 2024-03-19

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add created_at and last_login to users table
    op.add_column("users", sa.Column("created_at", sa.DateTime(), nullable=True))
    op.add_column("users", sa.Column("last_login", sa.DateTime(), nullable=True))

    # Add created_at to words table
    op.add_column("words", sa.Column("created_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    # Remove created_at and last_login from users table
    op.drop_column("users", "created_at")
    op.drop_column("users", "last_login")

    # Remove created_at from words table
    op.drop_column("words", "created_at")
