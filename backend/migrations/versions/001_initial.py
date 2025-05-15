"""initial

Revision ID: 001
Revises:
Create Date: 2024-03-19 10:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # No more enums, use strings instead

    # Create words table
    op.create_table(
        "words",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("greek_word", sa.String(), nullable=True),
        sa.Column("word_type", sa.String(), nullable=True),
        sa.Column("gender", sa.String(), nullable=True),
        sa.Column("notes", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_words_greek_word"), "words", ["greek_word"], unique=False)
    op.create_index(op.f("ix_words_id"), "words", ["id"], unique=False)

    # Create meanings table
    op.create_table(
        "meanings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("english_meaning", sa.String(), nullable=True),
        sa.Column("is_primary", sa.Boolean(), nullable=True),
        sa.Column("word_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["word_id"],
            ["words.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_meanings_id"), "meanings", ["id"], unique=False)


def downgrade():
    op.drop_table("meanings")
    op.drop_table("words")
