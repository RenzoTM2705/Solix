import { ProfileMenu } from "./ProfileMenu";

export const AppTopBar = () => {
    return (
        <header className="flex flex-col gap-3 bg-[rgba(250,248,255,0.8)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/GAUjAjEyGT.png)] bg-cover bg-no-repeat" />
                <span className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#003d9b]">
                    Solix
                </span>
            </div>

            <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-4">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <div className="h-[20px] w-[16px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/4pmBka5dZ8.png)] bg-cover bg-no-repeat" />
                    <div className="absolute right-[7px] top-[8px] h-2 w-2 rounded-full bg-[#ba1a1a]" />
                </div>
                <ProfileMenu avatarClassName="h-10 w-10" />
            </div>
        </header>
    );
};