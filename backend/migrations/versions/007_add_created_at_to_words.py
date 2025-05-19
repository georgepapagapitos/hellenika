"""add created_at to words

Revision ID: 007
Revises: 006
Create Date: 2024-03-19

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("words", sa.Column("created_at", sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column("words", "created_at")
