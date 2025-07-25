export function Footer() {
    return (
        <footer className="bg-[#174869] text-center dark:bg-gray-800 py-6">
            <div className="container mx-auto px-4 text-center text-white dark:text-gray-300">
                <p>&copy; {new Date().getFullYear()} Katerina Savidaki. All rights reserved.</p>
            </div>
        </footer>
    );
}