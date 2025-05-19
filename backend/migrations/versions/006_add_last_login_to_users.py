"""add last_login to users

Revision ID: 006
Revises: 005
Create Date: 2024-03-19

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("last_login", sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column("users", "last_login")
