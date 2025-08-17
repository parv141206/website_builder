import React from "react";
import { useNode } from "@craftjs/core";
import { motion } from "framer-motion";

export const ImageLeftCard = ({ image, title, text }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <motion.div
      ref={(ref) => connect(drag(ref))}
      className="flex max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.img
        src={image}
        alt={title}
        className="w-1/3 object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{text}</p>
      </div>
    </motion.div>
  );
};

ImageLeftCard.craft = {
  displayName: "Image Left Card",
  props: {
    image: "https://via.placeholder.com/150",
    title: "Image Left Card",
    text: "This card has an image on the left.",
  },
};
