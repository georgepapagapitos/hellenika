"""add created_by to words

Revision ID: 009
Revises: 008
Create Date: 2024-03-21

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "009"
down_revision = "008"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("words", sa.Column("created_by", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_words_created_by_users", "words", "users", ["created_by"], ["id"]
    )


def downgrade():
    op.drop_constraint("fk_words_created_by_users", "words", type_="foreignkey")
    op.drop_column("words", "created_by")
