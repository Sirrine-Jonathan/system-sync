import type { GoogleUser } from '~/services/auth.server'
import { useOutletContext } from '@remix-run/react'
import { SignInButton } from '~/components/Auth/SignInButton'
import styled from '@emotion/styled'

export const handle = {
    title: 'About',
}

const ContactLink = styled.a`
    text-decoration: underline;
    color: var(--color-white);
    transition: color 0.2s ease-in-out;

    &:hover {
        color: var(--accent-color);
    }
`

export default function About() {
    const user = useOutletContext<GoogleUser>()

    return (
        <main>
            <section id="about">{!user && <SignInButton />}</section>
            <section>
                This is a simple app to help you track your habits, and tasks
                across your calendar.
                <br />
                It is a work in progress.
                <br />
                <br />
                If you have any suggestions, please contact me at{' '}
                <ContactLink href="sirrineprogrContactLinkmming@gmail.com">
                    sirrineprogramming@gmail.com
                </ContactLink>
            </section>
        </main>
    )
}
