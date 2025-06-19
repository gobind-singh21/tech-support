from typing import List, Optional
from ..schema.schema import Priority, Category, SupportTicket # Import enums and the SupportTicket model
import requests
import json

TICKETING_SYSTEM_API_URL = "https://68545f3a6a6ef0ed662ef05f.mockapi.io/ticket/ticket"
TICKETING_API_KEY = "YOUR_API_KEY" # Or other authentication method

def create_support_ticket(
    title: str,
    description: str,
    priority: str,  # Change to str for tool's input
    category: str,  # Change to str for tool's input
    user_name: Optional[str] = None,
    user_email: Optional[str] = None,
    steps_to_reproduce: Optional[List[str]] = None,
    attachments: Optional[List[str]] = None,
) -> str:
  """
  Creates a new support ticket with the provided data.
  Returns the ticket ID or a success message.
  """
  try:
    # Validate and convert priority and category strings to Enum members
    validated_priority = Priority(priority.lower()) # Ensure case-insensitivity
    validated_category = Category(category.lower()) # Ensure case-insensitivity

    # Construct the SupportTicket Pydantic model internally
    ticket_data = SupportTicket(
        title=title,
        description=description,
        priority=validated_priority,
        category=validated_category,
        user_name=user_name,
        user_email=user_email,
        steps_to_reproduce=steps_to_reproduce,
        attachments=attachments
    )

    headers = {
      "Content-Type": "application/json",
      "Authorization": f"Bearer {TICKETING_API_KEY}" # Example: Bearer token
    }

    # Convert Pydantic model to dictionary, filtering out None values
    payload = ticket_data.model_dump(exclude_none=True)
    response = requests.post(
      TICKETING_SYSTEM_API_URL,
      data=json.dumps(payload),
      headers=headers
    )
    response.raise_for_status() # Raise an exception for HTTP errors
    result = response.json()
    ticket_id = result.get("id") or result.get("ticket_id") # Adjust based on your API's response
    if ticket_id:
      return f"Successfully created ticket with ID: {ticket_id}"
    else:
      return f"Ticket created, but no ID returned. Response: {result}"
  except ValueError as ve:
    return f"Error: Invalid priority or category value provided: {ve}"
  except requests.exceptions.RequestException as e:
    return f"Error creating ticket: {e}"
  except Exception as e:
    return f"An unexpected error occurred: {e}"