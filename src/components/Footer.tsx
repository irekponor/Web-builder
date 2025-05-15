import { FaHeart } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="md:pl-90 md:ml-24 max-md:mt-[49rem] ">
      <h1 className="flex max-md:pl-12">
        <i className="pr-2">Made with</i> <FaHeart className="text-red-700" />
        <i className="pl-2">by Emmanuel Irekponor</i>
      </h1>
    </div>
  );
};

export default Footer;
