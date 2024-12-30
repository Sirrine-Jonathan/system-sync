import styled from '@emotion/styled'

export const StyledForm = styled.div<{
    state: 'idle' | 'submitting' | 'loading'
}>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    border-radius: 5px;
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    background: ${(props) => {
        switch (props.state) {
            case 'idle':
                return 'transparent'
            case 'submitting':
                return 'black'
            case 'loading':
                return 'var(--accent-color)'
        }
    }};

    h2 {
        margin: 0;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .formTitle {
        font-size: 1.2rem;
    }

    .formSectionTitle {
        font-size: 1rem;
    }

    label {
        font-size: 0.7rem;
        color: var(--color-white);
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    input,
    textarea {
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--color-white);
        padding: 0.5rem;
        color: var(--color-white);
        word-break: break-all;
        width: 100%;
        box-sizing: border-box;
    }

    textarea {
        resize: none;
        height: 100px;
    }

    input[type='number'] {
        &:webkit-inner-spin-button {
            -webkit-appearance: none;
        }

        &:webkit-outer-spin-button {
            -webkit-appearance: none;
        }

        -moz-appearance: textfield;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    input[type='datetime-local'] {
        &::-webkit-calendar-picker-indicator {
        }

        & + img {
            position: absolute;
            right: 0;
            bottom: 5px;
            pointer-events: none;
        }
    }

    input[type='date'],
    input[type='time'],
    input[type='datetime-local'] {
        &::-webkit-calendar-picker-indicator {
            opacity: 0;
        }

        & + img {
            position: absolute;
            right: 0;
            bottom: 5px;
            pointer-events: none;
        }
    }

    .inputWithSuffix {
        display: flex;
        align-items: end;
        gap: 0.5rem;
    }

    select {
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--color-white);
        padding: 0.5rem;
        color: var(--color-white);
        box-sizing: border-box;
    }

    .error {
        input[required],
        textarea[required] {
            border: 1px solid red;
        }
    }

    .idle {
        background: red;
    }
`
