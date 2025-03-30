import {
  getUserIdentifier,
  SelfBackendVerifier,
  countryCodes,
} from "@selfxyz/core";

export async function POST(req) {
  try {
    // Parse the JSON body and log it
    const body = await req.json();
    console.log("Received request body:", body);

    const { proof, publicSignals } = body;
    if (!proof || !publicSignals) {
      console.error("Missing proof or publicSignals. Received:", body);
      return new Response(
        JSON.stringify({ message: "Proof and publicSignals are required" }),
        { status: 400 }
      );
    }

    // Extract user ID from the public signals included in the proof
    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", userId);

    // Initialize and configure the verifier
    const selfBackendVerifier = new SelfBackendVerifier(
      "https://forno.celo.org", // Celo RPC URL (we recommend using Forno)
      "ethTaipie", // The same scope used in the front-end
      "uuid",
      true
    );

    // Configure verification options
    selfBackendVerifier.setMinimumAge(18);
    selfBackendVerifier.excludeCountries(
      countryCodes.IRN, // Exclude Iran
      countryCodes.PRK // Exclude North Korea
    );
    // Optionally, enable additional checks
    // selfBackendVerifier.enableNameAndDobOfacCheck();

    // Verify the proof and log the result
    const result = await selfBackendVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (!result.isValid) {
      console.log("Verification succeeded for userId:", userId);
      return new Response(
        JSON.stringify({
          status: "success",
          result: true,
          credentialSubject: result.credentialSubject,
        }),
        { status: 200 }
      );
    } else {
      console.error("Verification failed with details:", result.isValidDetails);
      return new Response(
        JSON.stringify({
          status: "error",
          result: false,
          message: "Verification failed",
          details: result.isValidDetails,
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        result: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
