import { getUserIdentifier, SelfBackendVerifier, countryCodes } from '@selfxyz/core';

export async function POST(req) {
  try {
    const { proof, publicSignals } = await req.json();

    if (!proof || !publicSignals) {
      return new Response(
        JSON.stringify({ message: 'Proof and publicSignals are required' }),
        { status: 400 }
      );
    }

    // Extract user ID from the public signals included in the proof
    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", userId);

    // Initialize and configure the verifier using environment-specific values
    const selfBackendVerifier = new SelfBackendVerifier(
      'https://forno.celo.org', // Celo RPC URL (we recommend using Forno)
      'ethTaipie',              // The same scope used in the front-end
      'uuid',
      true
    );

    // Configure verification options
    selfBackendVerifier.setMinimumAge(18);
    selfBackendVerifier.excludeCountries(
      countryCodes.IRN, // Exclude Iran
      countryCodes.PRK  // Exclude North Korea
    );
    // selfBackendVerifier.enableNameAndDobOfacCheck();

    // Verify the proof
    const result = await selfBackendVerifier.verify(proof, publicSignals);

    if (result.isValid) {
      return new Response(
        JSON.stringify({
          status: 'success',
          result: true,
          credentialSubject: result.credentialSubject,
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: 'error',
          result: false,
          message: 'Verification failed',
          details: result.isValidDetails,
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying proof:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
}
