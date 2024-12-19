/**
 * Форматирует дату в строку формата "день.месяц.год".
 * @param dateString Строка, представляющая дату (например, "2024-12-20").
 * @returns Форматированная строка даты.
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU"); // Форматирует как "день.месяц.год".
};

/**
 * Извлекает год из строки даты, числа или объекта Date.
 * @param dateString Дата в формате строки, числа или объекта Date.
 * @returns Год.
 */
export const extractYear = (dateString: string | number | Date): number => {
    return new Date(dateString).getFullYear();
};

/**
 * Преобразует строку даты в объект Date.
 * @param dateString Строка, представляющая дату.
 * @returns Объект Date.
 */
export const parseDate = (dateString: string): Date => {
    return new Date(dateString);
};

/**
 * Форматирует статус выполнения в текстовое значение.
 * @param value Булево значение.
 * @returns Текст "Да" или "Нет".
 */
export const formatCompletionStatus = (value: boolean): string => {
    return value ? "Да" : "Нет";
};

/**
 * Выполняет GET-запрос к API и вызывает setter для обновления состояния.
 * @param url URL для выполнения запроса.
 * @param setter Функция для обновления состояния (например, setState).
 * @param setError Функция для обработки ошибок (например, setError).
 */
export const fetchData = async (
    url: string,
    setter: (data: any) => void,
    setError: (error: string) => void
): Promise<void> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setter(data);
    } catch (err) {
        setError((err as Error).message); // Обновляем состояние ошибки.
    }
};

export const handleFacultyChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setStudent: React.Dispatch<React.SetStateAction<any>>
) => {
    e.preventDefault();
    const selectedFaculty = e.target.value;
    setStudent((prev) => ({
        ...prev,
        faculty_id: selectedFaculty,
        department_id: "", // Очистим кафедру при смене факультета
    }));
};

export const handleDepartmentChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setStudent: React.Dispatch<React.SetStateAction<any>>
) => {
    setStudent((prev) => ({
        ...prev,
        department_id: e.target.value,
    }));
};

export const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setStudent: React.Dispatch<React.SetStateAction<any>>
) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
        ...prev,
        [name]: value,
    }));
};
