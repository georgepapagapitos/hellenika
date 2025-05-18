"""add role to users

Revision ID: 004
Revises: 003
Create Date: 2024-03-19 10:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "004"
down_revision = "003"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("role", sa.String(), nullable=True, server_default="user"))


def downgrade():
    op.drop_column("users", "role") 