from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

# Define enums for controlled vocabulary
class Priority(str, Enum):
  LOW = "low"
  MEDIUM = "medium"
  HIGH = "high"
  CRITICAL = "critical"

class Category(str, Enum):
  TECHNICAL = "technical"
  BILLING = "billing"
  ACCOUNT = "account"
  GENERAL = "general"
  SOFTWARE = "software"
  HARDWARE = "hardware"
  NETWORK = "network"

# Define the schema for a support ticket
class SupportTicket(BaseModel):
  title: str = Field(..., description="A brief, concise summary of the issue.")
  description: str = Field(..., description="A detailed description of the user's complaint, including symptoms, error messages, and impact.")
  priority: Priority = Field(..., description="The urgency level of the ticket.")
  category: Category = Field(..., description="The category of the issue.")
  user_name: Optional[str] = Field(None, description="The name of the user reporting the issue.")
  user_email: Optional[str] = Field(None, description="The email of the user reporting the issue.")
  steps_to_reproduce: Optional[List[str]] = Field(None, description="Steps that can be followed to reproduce the issue.")
  attachments: Optional[List[str]] = Field(None, description="URLs or references to any attached files (e.g., screenshots).")

class UserComplaint(BaseModel):
  complaint: str = Field(..., description="The user's description of their IT issue.")
  user_name: Optional[str] = Field(None, description="The name of the user.")
  user_email: Optional[str] = Field(None, description="The email address of the user.")