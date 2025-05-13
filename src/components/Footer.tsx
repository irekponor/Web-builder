import { FaHeart } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="pl-90 ml-43">
      <h1 className="flex">
        <i className="pr-2">Made with</i> <FaHeart className="text-red-700" />
        <i className="pl-2">by Emmanuel irekponor</i>
      </h1>
    </div>
  );
};

export default Footer;
