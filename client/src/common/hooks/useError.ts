import { useCallback, useState } from 'react';

type ErrorMessage = string | null;
type UpdateErrorMessage = (message: ErrorMessage) => void;

export function useError(): [ErrorMessage, UpdateErrorMessage] {
	const [errorMessage, setErrorMessage] = useState<ErrorMessage>(null);

	const updateErrorMessage: UpdateErrorMessage = useCallback(message => {
		setErrorMessage(message);
	}, []);

	return [errorMessage, updateErrorMessage];
}
