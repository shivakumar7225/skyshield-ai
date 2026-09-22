"""Initial SkyShield AI schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-09-11 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from app.database import Base
from app.database import engine
import app.models

revision = '0001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    Base.metadata.create_all(bind=op.get_bind())

def downgrade() -> None:
    Base.metadata.drop_all(bind=op.get_bind())
