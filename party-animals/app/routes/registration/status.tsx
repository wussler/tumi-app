import { LoaderFunction, redirect } from 'remix';
import { authenticator } from '~/services/auth.server';
import { Prisma, PrismaClient, Registration } from '~/generated/prisma';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/services/prisma.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return redirect('/registration');
  const registration = await prisma.registration.findFirst({
    where: {
      user: {
        id: user.id,
      },
    },
  });
  if (!registration) return redirect('/registration/form');
  return registration;
};

export default function RegistrationStatus() {
  const registration = useLoaderData<Registration>();
  return (
    <div>
      <h2 className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text py-2 text-2xl font-bold leading-loose text-transparent md:col-span-2 md:text-4xl">
        You registered!
      </h2>
      <p className="lg:text-lg">We will be in contact about further steps.</p>
      <p className="mt-2 lg:text-lg">
        The first admission mails will be sent out on the 23rd of march, please
        check your mails in the evening to confirm your spot. Spots that are not
        confirmed within 24h will be reallocated.
      </p>
    </div>
  );
}
