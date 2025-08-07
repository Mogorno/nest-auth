import {
	Html,
	Body,
	Container,
	Heading,
	Text,
	Hr,
	Section,
	Tailwind,
} from '@react-email/components';
import * as React from 'react';

export interface TwoFactorAuthTemplateProps {
	token: string;
}

export const TwoFactorAuthTemplate: React.FC<TwoFactorAuthTemplateProps> = ({
	token,
}) => {
	return (
		<Tailwind>
			<Html>
				<Body className="bg-[#f6f9fc] font-sans py-10">
					<Container className="bg-white rounded-lg max-w-xl mx-auto px-10 py-10 shadow-md">
						<Heading className="text-2xl font-semibold text-gray-800 mb-6 text-center">
							Your 2FA Code
						</Heading>

						<Text className="text-base text-gray-700 mb-2">Hello 👋</Text>

						<Text className="text-base text-gray-700 mb-6">
							To complete your login, please enter the following two-factor
							authentication code:
						</Text>

						<Section className="text-center my-8">
							<Text className="text-3xl font-bold text-gray-900 tracking-widest">
								{token}
							</Text>
						</Section>

						<Text className="text-sm text-gray-600 mb-6 text-center">
							This code is valid for a limited time. If you did not attempt to
							log in, please ignore this message.
						</Text>

						<Hr className="my-8 border-gray-200" />

						<Text className="text-xs text-gray-500 text-center">
							Stay secure, and thank you for using our service.
						</Text>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};
