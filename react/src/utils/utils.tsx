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

export const handleSaveStudent = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    studentData: object,
    action: string,
    setError: (error: string) => void,
    setAlert: (error: string) => void
) => {
    e.preventDefault();
    const requiredFields = [
        "ticket_number",
        "full_name",
        "faculty_id",
        "enrollment_date",
        "education_level",
    ];
    const isAllFieldsFilled = requiredFields.every(
        (field) => studentData[field].trim() !== ""
    );

    if (!isAllFieldsFilled) {
        // alert("Не все обязательные поля заполнены");
        setAlert({
            message: "Не все обязательные поля заполнены!",
        });
    } else {
        let method;
        try {
            switch (action) {
                case 'new':
                    method = "POST"
                    break
                case 'update':
                    method = "PUT"
                    break
            }

            const response = await fetch("/api/student", {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            let alertText;
            switch (action) {
                case 'new':
                    alertText = "создан"
                    break
                case 'update':
                    alertText = "изменен"
                    break
            }
            setAlert({
                message: "Студент успешно " + alertText + ".",
            });
        } catch (err) {
            setError(err.message);
        }
    }
};
