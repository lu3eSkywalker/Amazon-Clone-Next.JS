/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/logingeneral',
                permanent: false,
            }
        ]
    }

};

export default nextConfig;
