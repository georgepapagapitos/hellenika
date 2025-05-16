"""remove username column from users

Revision ID: 003
Revises: 002
Create Date: 2024-05-15 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None

def upgrade():
    op.drop_column('users', 'username')

def downgrade():
    op.add_column('users', sa.Column('username', sa.String(), nullable=True)) 