/** @type {import("next").NextConfig} */
const nextConfig = {
    // images: {
    //     domains: ["raw.githubusercontent.com", "poke-assessment.driptrace.io"],
    // },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "poke-assessment.driptrace.io",
                pathname: "**",
            },
        ]
    }
}
    ;

export default nextConfig;
