import {
	Html,
	Body,
	Container,
	Heading,
	Text,
	Link,
	Button,
	Hr,
	Section,
	Tailwind,
} from '@react-email/components';
import * as React from 'react';

export interface ConfirmationTemplateProps {
	domain: string;
	token: string;
}

export const ConfirmationTemplate: React.FC<ConfirmationTemplateProps> = ({
	domain,
	token,
}) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;

	return (
		<Tailwind>
			<Html>
				<Body className="bg-[#f6f9fc] font-sans py-10">
					<Container className="bg-white rounded-lg max-w-xl mx-auto px-10 py-10 shadow-md">
						<Heading className="text-2xl font-semibold text-gray-800 mb-6">
							Confirm your email
						</Heading>

						<Text className="text-base text-gray-700 mb-2">Hello 👋</Text>

						<Text className="text-base text-gray-700 mb-6">
							Thank you for signing up! Please confirm your email address to
							complete the registration.
						</Text>

						<Section className="text-center my-8">
							<Button
								className="bg-blue-600 text-white text-base px-6 py-3 rounded-md no-underline"
								href={confirmLink}
							>
								Confirm Email
							</Button>
						</Section>

						<Text className="text-sm text-gray-600 mb-2">
							If the button doesn’t work, copy and paste the link below into
							your browser:
						</Text>

						<Link
							className="text-blue-600 break-all text-sm"
							href={confirmLink}
						>
							{confirmLink}
						</Link>

						<Hr className="my-8 border-gray-200" />

						<Text className="text-xs text-gray-500 text-center">
							If you didn’t request this, you can safely ignore this email.
						</Text>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};
