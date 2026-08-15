export const CREATE_SUPPORT_TICKET_MUTATION = `
  mutation CreateSupportTicket($input: CreateSupportTicketInput!) {
    createSupportTicket(input: $input) {
      success
      message
      ticket {
        id
        ticketNo
        status
        createdAt
      }
    }
  }
`;

export const MY_SUPPORT_TICKETS_QUERY = `
  query MySupportTickets {
    mySupportTickets {
      items {
        id
        ticketNo
        subject
        status
        priority
        lastMessageAt
        unreadCount
        createdAt
      }
    }
  }
`;

export const MY_SUPPORT_TICKET_QUERY = `
  query SupportTicketDetail($ticketId: ID!) {
    supportTicket(id: $ticketId) {
      id
      ticketNo
      subject
      status
      priority
      createdAt
      messages {
        id
        message
        createdAt
      }
    }
  }
`;

export const REPLY_TO_OWN_SUPPORT_TICKET_MUTATION = `
  mutation ReplySupportTicket($input: ReplySupportTicketInput!) {
    replySupportTicket(input: $input) {
      success
      message
      messageItem {
        id
        message
        createdAt
      }
      ticket {
        id
        lastMessageAt
        unreadCount
        status
      }
    }
  }
`;
