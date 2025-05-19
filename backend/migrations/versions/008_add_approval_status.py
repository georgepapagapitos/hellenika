"""add approval status

Revision ID: 008
Revises: 007
Create Date: 2024-03-21

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade():
    # Create enum type
    approval_status = postgresql.ENUM(
        "pending", "approved", "rejected", name="approvalstatus"
    )
    approval_status.create(op.get_bind())

    # Add column with default value
    op.add_column(
        "words",
        sa.Column(
            "approval_status",
            sa.Enum("pending", "approved", "rejected", name="approvalstatus"),
            nullable=False,
            server_default="approved",
        ),
    )


def downgrade():
    # Remove column
    op.drop_column("words", "approval_status")

    # Drop enum type
    approval_status = postgresql.ENUM(name="approvalstatus")
    approval_status.drop(op.get_bind())
