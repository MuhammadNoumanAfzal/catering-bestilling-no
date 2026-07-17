import { graphqlRequest } from "../../../../lib/api/graphqlClient";

const DEACTIVATE_CUSTOMER_ACCOUNT_MUTATION = `
  mutation DeactivateCustomerAccount($input: CustomerDeactivateAccountInput!) {
    deactivateCustomerAccount(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      account {
        id
        isActive
        deactivatedAt
      }
    }
  }
`;

const DELETE_CUSTOMER_ACCOUNT_MUTATION = `
  mutation DeleteCustomerAccount($input: CustomerDeleteAccountInput!) {
    deleteCustomerAccount(input: $input) {
      success
      message
      errors {
        field
        message
        code
      }
      deletedAt
    }
  }
`;

function getMutationErrorMessage(result, fallbackMessage) {
  if (Array.isArray(result?.errors) && result.errors.length > 0) {
    const detail = result.errors
      .map((item) => item?.message)
      .filter(Boolean)
      .join(" ");

    if (detail) {
      return detail;
    }
  }

  return result?.message || fallbackMessage;
}

export async function deactivateCustomerAccount({ password, reason }) {
  const data = await graphqlRequest({
    query: DEACTIVATE_CUSTOMER_ACCOUNT_MUTATION,
    variables: {
      input: {
        password,
        reason,
      },
    },
  });

  const result = data?.deactivateCustomerAccount;

  if (!result?.success) {
    throw new Error(
      getMutationErrorMessage(result, "Unable to deactivate your account."),
    );
  }

  return {
    message:
      result.message || "Your account has been deactivated successfully.",
    account: result.account || null,
  };
}

export async function deleteCustomerAccount({
  password,
  confirmationText,
  reason,
}) {
  const data = await graphqlRequest({
    query: DELETE_CUSTOMER_ACCOUNT_MUTATION,
    variables: {
      input: {
        password,
        confirmationText,
        reason,
      },
    },
  });

  const result = data?.deleteCustomerAccount;

  if (!result?.success) {
    throw new Error(
      getMutationErrorMessage(result, "Unable to delete your account."),
    );
  }

  return {
    message:
      result.message || "Your account and data have been permanently deleted.",
    deletedAt: result.deletedAt || "",
  };
}
